"use client";

const X_LOGO = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface TweetCardProps {
  name: string;
  handle: string;
  tweetId: string;
  text: string;
  subtitle?: string;
  avatarUrl?: string;
  verified?: boolean;
}

function TweetCard({
  name,
  handle,
  tweetId,
  text,
  subtitle,
  avatarUrl,
  verified = false,
}: TweetCardProps) {
  const tweetUrl = `https://x.com/${handle}/status/${tweetId}`;

  return (
    <a
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl border border-gray-700/60 bg-gray-900/60 p-5 transition hover:border-gray-600 hover:bg-gray-900/80"
    >
      {/* Header: avatar + name + X logo */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-10 w-10 rounded-full bg-gray-800"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-sm font-bold text-gray-400">
              {name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="truncate text-sm font-semibold text-gray-100">
                {name}
              </span>
              {verified && (
                <svg
                  viewBox="0 0 22 22"
                  className="h-4 w-4 shrink-0 text-blue-400"
                  fill="currentColor"
                >
                  <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.607-.274 1.264-.144 1.897.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-500">@{handle}</span>
          </div>
        </div>
        <span className="text-gray-500 transition group-hover:text-gray-300">
          {X_LOGO}
        </span>
      </div>

      {/* Tweet text */}
      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-gray-200 whitespace-pre-line">
        {text}
      </p>

      {/* Subtitle (optional: title, context) */}
      {subtitle && (
        <p className="mt-2 text-xs text-gray-500">{subtitle}</p>
      )}
    </a>
  );
}

export function TestimonialGrid({
  tweets,
  columns = 3,
}: {
  tweets: TweetCardProps[];
  columns?: 2 | 3;
}) {
  const gridCols =
    columns === 2
      ? "sm:grid-cols-2"
      : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid gap-5 ${gridCols}`}>
      {tweets.map((tweet) => (
        <TweetCard key={tweet.tweetId} {...tweet} />
      ))}
    </div>
  );
}

export { TweetCard };
