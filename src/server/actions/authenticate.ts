"use server";
import { auth} from "@clerk/nextjs/server";

const authenticate = async () => {
  const { userId } = await auth();

  if (!userId) {
    (await auth()).redirectToSignIn();
  } else {
    return userId;
    }
  }


export default authenticate;
