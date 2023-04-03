import React from "react";

const SubmitButton = ({ handleSubmit, disabled, content }) => {
  return (
    <button
      className="submit-btn"
      onClick={handleSubmit}
      disabled={disabled}
      content={content}>
      {content || "Submit"}
    </button>
  );
};

export default SubmitButton;
