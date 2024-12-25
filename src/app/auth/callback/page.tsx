import authenticate from "@/server/actions/authenticate";
import { redirect } from "next/navigation";

const AuthCallback =async () => {
      const result =   await authenticate();
      if(result){
        redirect("/dashboard")
      }
};

export default AuthCallback;
