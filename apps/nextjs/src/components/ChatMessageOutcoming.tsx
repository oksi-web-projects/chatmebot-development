import Moment from "react-moment";

export function ChatMessageOutcoming(props: {
  children: React.ReactNode;
  image?: string;
  createdAt?: Date;
}) {
  return (
    <>
      <div className="flex justify-end">
        <div className="rounded-lg bg-blue-200 px-3 py-2">
          <div className="flex flex-col gap-1">
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
      </div>
    </>
  );
}
