export function ChatMessageSystem(props: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex justify-center">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap rounded-full bg-gray-400 px-3 py-1 text-xs text-white">
          {props.children}
        </div>
      </div>
    </>
  );
}
