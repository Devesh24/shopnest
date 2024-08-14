import Home from "@/components/shared/Home";
import { auth } from "@clerk/nextjs/server"

export default function HomePage() {

    // to find the details from the public metadata from clerk
    const { sessionClaims } = auth()
    const userId = sessionClaims && String(sessionClaims.userId)
    
  return (
    <main>
        <Home userId={userId} />
    </main>
  );
}
