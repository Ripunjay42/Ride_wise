import Navbar from "@/components/Navbar";

export default function  WithNavLayout({ children }) {
    return (
      <>
          <Navbar />
          <main>{children}</main>
      </>
    );
  };
  