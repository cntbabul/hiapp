const MessageSkeleton = () => {
  const skeletonMessage = Array(6).fill(null);
  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {skeletonMessage.map((_, index) => {
          return (
            <div
              key={index}
              className={`flex item-start gap-3 ${index % 2 === 0 ? 'justify-start' : 'justify-end flex-row-reverse'
                }`}
            >
              {/* avatar  */}
              <div className="h-10 w-10 rounded-full bg-gray-300 animate-pulse">
                {/* message bubble  */}
                <div className="h-4 w-16 bg-gray-300 rounded mb-2 animate-pulse" />
                <div className="w-[200px] h-16 bg-gray-300 rounded-lg animate-pulse" />
              </div>
            </div>
          )
        })}
      </div>
    </>);
};

export default MessageSkeleton;
