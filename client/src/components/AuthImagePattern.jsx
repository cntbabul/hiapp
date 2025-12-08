const AuthImagePattern = ({ title, subtitle }) => {
  return (<>
    <div className="hidden lg:flex item-center justify-center p-12">
      <div className="max-w-sm text-center">
        {/* grid pattern  */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {
            [...Array(9)].map((_, i) => {
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-2xl bg-gray-700/30 ${i % 2 === 0 ? "animate-pulse" : ""}`} />

              )
            })
          }

        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-500">{subtitle}</p>
      </div>

    </div>
  </>)
};

export default AuthImagePattern;
