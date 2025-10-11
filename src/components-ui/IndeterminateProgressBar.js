export default function IndeterminateProgressBar({ isLoading }) {
  return (
    isLoading && (
      <div
        style={{
          position: "relative",
          width: "20%",
          height: "8px",
          margin: "0 auto",
          backgroundColor: "#eee",
          overflow: "hidden",
          borderRadius: "4px",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "30%",
            height: "100%",
            backgroundColor: "#4caf50",
            animation: "move 1.5s infinite",
          }}
        />
        <style>{`
          @keyframes move {
            0% { left: -30%; }
            50% { left: 100%; }
            100% { left: -30%; }
          }
        `}</style>
      </div>
    )
  );
}
