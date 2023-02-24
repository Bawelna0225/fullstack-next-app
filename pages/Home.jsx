import { useEffect, useState } from 'react'
import { useSession } from "next-auth/react";
import Router from "next/router";

const Home = () => {
	const { status, data } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") Router.replace("/auth/signin");
  }, [status]);

  if (status === "authenticated")
    return (
      <div>
       <h1>Welcome {data.user.name}</h1> 
      </div>
    );

  return <div>loading</div>;
}

export default Home
