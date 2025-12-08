import { Image, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { sendMessage, pushNewMessage } from "../store/slices/chatSlice";
import { getSocket } from "../lib/socket";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null);
  const [media, setMedia] = useState(null)
  const [mediaType, setMediaType] = useState("")
  const fileInputRef = useRef(null);
  const { selectedUser } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const type = file.type;
    console.log("Selected file type:", type);

    if (type.startsWith("image/")) {
      setMedia(file);
      setMediaType("image");
      const reader = new FileReader();
      reader.onload = () => {
        setMediaPreview(reader.result);
      }
      reader.readAsDataURL(file);
    } else if (type.startsWith("video/")) {
      setMedia(file);
      setMediaType("video");
      const videoUrl = URL.createObjectURL(file);
      setMediaPreview(videoUrl);
    } else {
      toast.error("Please select an image or video file");
      setMediaPreview(null);
      setMedia(null);
      setMediaType("");
      return;
    }
  }

  const removeMedia = () => {
    setMedia(null);
    setMediaPreview(null);
    setMediaType("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !media) return;

    try {
      const data = new FormData();
      data.append("text", text.trim());
      if (media) {
        data.append("media", media);
      }

      await dispatch(sendMessage({ id: selectedUser._id, data }));

      // reset all 
      setText("");
      setMediaPreview(null);
      setMedia(null);
      setMediaType("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handleNewMessage = (newMessage) => {
      if (
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id
      ) {
        dispatch(pushNewMessage(newMessage))
      }
    }
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    }
  }, [selectedUser?._id, dispatch])


  return (
    <>
      <div className="p-4 w-full">
        {mediaPreview && (
          <div className="mb-3 flex items-center gap-2">
            <div className="relative">
              {
                mediaType === "image" ? (
                  <img src={mediaPreview} alt="preview"
                    className="w-20 h-20 object-cover rounded-lg border border-gray-700"
                  />
                ) : (
                  <video src={mediaPreview} controls className="w-32 h-20 object-cover rounded-lg border-gray-700"
                  />
                )
              }
              <button onClick={removeMedia} className="absolute -top-2 right-2 w-5 bg-zinc-800 text-white rounded-full flex items-center justify-center hover:bg-black">
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Type a message"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input type="file" accept="image/*,video/*" ref={fileInputRef} className="hidden" onChange={handleMediaChange} />
            <button type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:border-gray-100 transition ${mediaPreview ? "text-emerald-500" : "text-gray-400"}`} >
              <Image size={20} />
            </button>
          </div>
          <button
            type="submit"
            className="w-10 h-10 flex-none flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
            disabled={!text.trim() && !media}
          >
            <Send size={22} />
          </button>
        </form >
      </div >
    </>
  );
};

export default MessageInput;
