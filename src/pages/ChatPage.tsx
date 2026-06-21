import Navigation from "@/components/Navigation";
import ChatInterface from "@/components/ChatInterface";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      <div className="pt-20 pb-8 px-4 h-screen">
        <div className="max-w-[900px] mx-auto h-[calc(100vh-7rem)]">
          <ChatInterface showWelcome={true} />
        </div>
      </div>
    </div>
  );
}
