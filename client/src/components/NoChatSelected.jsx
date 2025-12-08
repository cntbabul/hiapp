import { MessageSquareDot } from "lucide-react";

const NoChatSelected = () => {
  return (
    <>
      <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-white/50">
        <div className="max-w-md text-center gap-4">
          {/* icon display  */}
          <div className="flex justify-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center animate-bounce">
                <MessageSquareDot className="w-8 h-8 tex-blue-600" />
              </div>
            </div>
          </div>
          {/* welcome text  */}
          <h2 className="text-2xl font-bold text-gray-800">Welcome to hiapp..</h2>
          <p className="text-gray-500">
            Select a chat to to connect people .
          </p>
        </div>
      </div>
    </>
  );
};

export default NoChatSelected;
