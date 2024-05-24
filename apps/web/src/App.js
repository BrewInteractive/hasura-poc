import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import {
  CREATE_ROOM,
  GET_ROOMS,
  GET_USER_BY_ID,
  INSERT_MESSAGE,
  INSERT_USER,
  LOGIN,
  PROFILE,
  SCHEDULE,
  SUBSCRIBE_MESSAGES,
} from "./query";
import React, { useEffect, useState } from "react";

import { WebSocketLink } from "@apollo/client/link/ws";

const grapqlEndpoint = process.env.REACT_APP_GRAPHQL_ENDPOINT;
const websocketEndpoint = process.env.REACT_APP_WEBSOCKET_ENDPOINT;

let client = new ApolloClient({
  uri: grapqlEndpoint,
  cache: new InMemoryCache(),
});

const createApolloSubscriptionClient = (authToken) => {
  return new ApolloClient({
    link: new WebSocketLink({
      uri: websocketEndpoint,
      options: {
        reconnect: true,
        connectionParams: {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      },
    }),
    cache: new InMemoryCache(),
  });
};

const Rooms = ({ rooms, loading, error, onSelectRoom }) => {
  if (loading) return <p>Loading rooms...</p>;
  if (error) return <p>Error loading rooms: {error.message}</p>;

  return (
    <ul>
      Room List:
      {rooms.map((room) => (
        <li
          className="list-item room"
          key={room.id}
          onClick={() => {
            onSelectRoom(room.id);
          }}
        >
          {room.user.name} {room.user.surname}'s Room: {room.name}
        </li>
      ))}
    </ul>
  );
};

const Messages = ({ messages, selectedRoom, userId }) => {
  const [newMessage, setNewMessage] = useState("");
  const sendNewMessage = async () => {
    if (!newMessage) return;
    await client.mutate({
      mutation: INSERT_MESSAGE,
      variables: { message: newMessage, room_id: selectedRoom },
    });
  };
  return (
    <ul>
      <li>
        <input
          type="text"
          placeholder="Type your message here"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendNewMessage}>Send</button>
      </li>
      {messages.map((msg) => (
        <li
          key={msg.id}
          className={msg.user_id === userId ? "align-right message" : "message"}
        >
          <span>
            {msg.user.name} {msg.user.surname}
          </span>
          : {msg.message}
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [createRoomName, setCreateRoomName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [roomsError, setRoomsError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState(null);
  const [meetingSchedule, setMeetingSchedule] = useState([]);

  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const { data } = await client.query({
        query: GET_ROOMS,
      });
      console.log("Rooms", data);
      setRooms(data.room);
      setLoadingRooms(false);
    } catch (error) {
      setRoomsError(error);
      setLoadingRooms(false);
    }
  };

  const subscribeToMessages = async (roomId) => {
    const subscriptionClient = createApolloSubscriptionClient(token);

    const observable = await subscriptionClient.subscribe({
      query: SUBSCRIBE_MESSAGES,
      variables: { room_id: roomId },
    });

    observable.subscribe({
      next: (data) => {
        setMessages(data.data.chat);
      },
      error: (error) => {
        console.error("Subscription error:", error);
      },
    });
  };

  const handleLogin = async () => {
    const loginResult = await client.query({
      query: LOGIN,
      variables: { username, password },
    });
    if (loginResult.data.login.loggedInUser) {
      const loggedInUser = loginResult.data.login.loggedInUser;
      const authToken = loggedInUser.authToken;
      setToken(authToken);
      const userId = loggedInUser.userId;
      setUserId(userId);

      client = new ApolloClient({
        uri: grapqlEndpoint,
        cache: new InMemoryCache(),
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setLoggedIn(true);
      getProfile();
      insertUserIfNotExists(userId, loggedInUser.fullName);
      await fetchRooms();
      getMeetingSchedule();
    }
  };

  const getMeetingSchedule = async () => {
    const result = await client.query({
      query: SCHEDULE,
    });
    setMeetingSchedule(result.data.schedule.meetings);
  };

  const insertUserIfNotExists = async (userId, fullName) => {
    const result = await client.query({
      query: GET_USER_BY_ID,
      variables: {
        userId: userId,
      },
    });
    if (result.data.user.length === 0) {
      var firstName = fullName.split(" ")[0];
      var lastName = fullName.split(" ").slice(1).join(" ");
      await client.mutate({
        mutation: INSERT_USER,
        variables: {
          name: firstName,
          surname: lastName,
          id: userId,
        },
      });
    }
  };

  const getProfile = async () => {
    const result = await client.query({
      query: PROFILE,
    });
    const profile = result.data.profile.profile;
    setProfile(profile);
  };

  const handleCreateRoom = async () => {
    try {
      const result = await client.mutate({
        mutation: CREATE_ROOM,
        variables: { name: createRoomName },
      });
      const roomId = result.data.insert_room.returning[0].id;
      setSelectedRoom(roomId);
      client.clearStore().then(() => {
        fetchRooms();
      });
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  useEffect(() => {
    if (selectedRoom) {
      subscribeToMessages(selectedRoom);
    }
  }, [selectedRoom]);

  return (
    <ApolloProvider client={client}>
      <div>
        {!loggedIn ? (
          <>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
          </>
        ) : (
          <div className="panel">
            <div className="card">
              <div>
                <h3>Spaces Profile</h3>
                <li className="list-item">
                  Account ID: {profile?.accountId}
                  <br />
                  Company: {profile?.company}
                  <br />
                  First Name: {profile?.firstName}
                  <br />
                  Language: {profile?.language}
                  <br />
                  Last Name: {profile?.lastName}
                  <br />
                  Mail: {profile?.mail}
                  <br />
                  Name: {profile?.name}
                  <br />
                  Phone: {profile?.phone}
                  <br />
                  Spaces User ID: {userId}
                </li>
              </div>
              <div>
                <h3>Spaces Meeting Schedule</h3>
                <ul>
                  {meetingSchedule.map((meeting) => (
                    <li className="list-item" key={meeting.meetingId}>
                      <span>{meeting.meetingName}</span>
                      <br />
                      Room: {meeting.meetingRoom.roomName} <br />
                      {meeting.meetingRoom.description}
                      <br />
                      Start Time: {new Date(meeting.startTime).toLocaleString()}
                      <br />
                      Url : {meeting.redirectURL}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="card">
              <div>
                <button onClick={handleCreateRoom}>Create Room</button>
                <input
                  value={createRoomName}
                  onChange={(e) => setCreateRoomName(e.target.value)}
                />
              </div>
              <Rooms
                rooms={rooms}
                loading={loadingRooms}
                error={roomsError}
                onSelectRoom={setSelectedRoom}
              />
            </div>
            {selectedRoom && (
              <div className="card">
                <span>
                  {rooms.length > 0 &&
                    rooms.find((room) => room.id === selectedRoom)?.name}
                </span>
                {selectedRoom && (
                  <Messages
                    messages={messages}
                    selectedRoom={selectedRoom}
                    userId={userId}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </ApolloProvider>
  );
};

export default App;
