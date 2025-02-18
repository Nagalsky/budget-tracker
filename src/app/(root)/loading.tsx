import Image from "next/image";

const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Image
        src="/logo.svg"
        alt="logo"
        width={100}
        height={100}
        className="size-16 animate-spin md:size-28"
        priority
      />
    </div>
  );
};

export default Loading;
