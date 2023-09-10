import Moment from "react-moment";

export function ChatMessageIncoming(props: {
  children: React.ReactNode;
  name?: string;
  image?: string;
  createdAt?: Date;
}) {
  return (
    <>
      <div className="flex">
        <div className="flex flex-col gap-1 rounded-lg bg-gray-200 px-3 py-2 text-left">
          {props.name ? (
            <>
              <p className="text-teal text-sm font-semibold">{props.name}</p>
            </>
          ) : null}
          {props.image ? (
            <>
              <img className="max-h-96 max-w-xs" alt="" src={props.image} />
            </>
          ) : null}
          <p className="text-sm">{props.children}</p>
          {props.createdAt ? (
            <>
              <p className="text-right text-xs text-gray-400">
                <Moment format="hh:mm">{props.createdAt}</Moment>
              </p>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
