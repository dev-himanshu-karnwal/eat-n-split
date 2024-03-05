import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Bhavya",
    image: "https://i.pravatar.cc/48?u=145836",
    balance: -200,
  },
  {
    id: 933372,
    name: "Harsh",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 10,
  },
  {
    id: 499476,
    name: "Anurag",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriendForm() {
    setShowAddFriendForm((show) => !show);
    setSelectedFriend(null);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriendForm(false);
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((selected) =>
      selected?.id === friend.id ? null : friend
    );
    setShowAddFriendForm(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelect={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriendForm && <AddFriendForm onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriendForm}>
          {showAddFriendForm ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <SplitBillForm
          key={selectedFriend.id}
          friend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendsList({ friends, onSelect, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          onSelect={onSelect}
          key={friend.id}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelect, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  function handleToggle() {}

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance === 0 && <p>No balance with {friend.name}</p>}
      {friend.balance < 0 && (
        <p className="red">You have to pay ₹{-friend.balance}</p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} will pay you ₹{friend.balance}
        </p>
      )}
      <Button onClick={() => onSelect(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function AddFriendForm({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label htmlFor="friend-name">
        <span>🙆‍♂️</span>Friend name
      </label>
      <input
        id="friend-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="image">🌞Image URL</label>
      <input
        id="image"
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function SplitBillForm({ friend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [payer, setPayer] = useState("user");

  const paidByFriend = bill ? bill - paidByUser : "";

  function handlePaidByUser(e) {
    const amt = +e.target.value;
    setPaidByUser((paidByUser) => (amt > bill ? paidByUser : amt));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill) return;

    const value = payer === "user" ? paidByFriend : -paidByUser;

    onSplitBill(value);

    setBill(0);
    setPaidByUser(0);
    setPayer("user");
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a Bill with {friend.name}</h2>

      <label htmlFor="bill">😎 Bill value</label>
      <input
        id="bill"
        type="number"
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
      />

      <label htmlFor="your-expense">😥 Your expense</label>
      <input
        id="your-expense"
        type="number"
        value={paidByUser}
        onChange={handlePaidByUser}
      />

      <label htmlFor="friend-expense">😁 {friend.name}'s expense</label>
      <input id="friend-expense" type="number" value={paidByFriend} disabled />

      <label>🤑 Who is paying the Bill</label>
      <select value={payer} onChange={(e) => setPayer(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>

      <Button>Split Now</Button>
    </form>
  );
}
