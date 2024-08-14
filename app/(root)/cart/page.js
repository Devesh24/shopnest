import UserCart from "@/components/shared/UserCart";
import { auth } from "@clerk/nextjs/server";

const page = async () => {

    // to find the details from the public metadata from clerk
    const { sessionClaims } = auth()
    const userId = sessionClaims && String(sessionClaims.userId)
    
  return (
    <div>
        <UserCart userId={userId} />
    </div>
  )
}

export default page