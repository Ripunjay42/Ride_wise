import Navbar from "@/components/Navbar";

export default function HelpLayout({ children }) {
  return (
    <>
        <Navbar />
        <main>{children}</main>
    </>
  );
};
