
export const Triangle = ({color}) => {
  const fill = color === "green" ? "#10A44E" : "#F03B31";
  const angle = {green : "rotate(0, 7.8, 7.8)", red: "rotate(180, 7.8, 7.8)"}
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.6 15.6" width="15.6" height="15.6">
        <path transform={angle[color]} 
          d="M10.215 6.31a0.65 0.65 0 0 1-0.92 0L8.45 5.47V11.7a0.65 0.65 0 0 1-1.3 0V5.47L6.305 6.31a0.65 0.65 0 0 1-0.92-0.92l1.95-1.95a0.65 0.65 0 0 1 0.92 0l1.95 1.95a0.65 0.65 0 0 1-0.002 0.92z" 
          fill={fill}
        />
      </svg>
      {/* <svg transform={`rotate(${angle})`} width="24" height="24" viewBox="0 2 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.00065 6.33301L4.66732 9.66634H11.334L8.00065 6.33301Z" fill={color} fillOpacity={1}/>
      </svg> */}
    </>
  );
};

