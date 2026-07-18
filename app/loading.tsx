import loader from "@/assets/loader.gif";
import Image from "next/image";

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Image 
        src={loader} 
        height={150} 
        width={150} 
        alt="Loading" 
        style={{ maxWidth: '150px', height: 'auto' }}
      />
    </div>
  );
};

export default Loading;
