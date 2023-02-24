import { signIn } from "next-auth/react";
import { useState } from "react";
import Router from "next/router";

const SignIn = () => {
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const [loginStatus, setLoginStatus] = useState('')
  const handleSubmit = async (e) => {
    
    e.preventDefault();

    const res = await signIn("credentials", {
      email: userInfo.email,
      password: userInfo.password,
      redirect: false,
    });
    if (res.ok) {
			setLoginStatus(`Logging in successful, Welcome!`)
			setTimeout(() => {
				Router.replace("/Home")
			}, 2000)
		} else {
			setLoginStatus(`Invalid Password or Email`)
		}
  };
  return (
    <div className="sign-in-form">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input
          value={userInfo.email}
          onChange={({ target }) =>
            setUserInfo({ ...userInfo, email: target.value })
          }
          type="email"
          placeholder="john@email.com"
        />
        <input
          value={userInfo.password}
          onChange={({ target }) =>
            setUserInfo({ ...userInfo, password: target.value })
          }
          type="password"
          placeholder="********"
        />
        <input type="submit" value="Login" />
      </form>
      {loginStatus}
    </div>
  );
};

async function fetchUserFromDatabase(email) {
	// pobranie użytkownika z bazy danych na podstawie adresu email

	const [users] = await connection.promise().query(`SELECT * FROM userdata`)

	return users.find((user) => user.email === email)
}

export default SignIn;