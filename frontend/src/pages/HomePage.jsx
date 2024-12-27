import { useChatStore } from "../store/useChatStore"
import Sidebar from "../Components/Sidebar";
import ChatContainer from "../Components/ChatContainer";
import NoChatSelected from "../Components/NoChatSelected";

const HomePage = () => {

  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className=" flex items-center justify-center pt-20 px-4">
        <div className=" bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]">{/* h-[calc(100vh-8rem)]:- this means calculate the total height of the screen and minus 8 rem from it  */}
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar /> 

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}

          </div>
        </div>
      </div>

    </div>
  )
}

export default HomePage