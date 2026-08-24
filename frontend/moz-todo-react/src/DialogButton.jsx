import Swal from "sweetalert2";

export const DialogButton = ({
  buttonText,
  dialogTitle,
  onConfirm,
  className = "btn",
}) => {
  const handleChange = () => {
    Swal.fire({
      title: dialogTitle,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "はい",
      cancelButtonText: "いいえ",
      confirmButtonColor: className.includes("delete") ? "#d33" : "#3085d6",
      cancelButtonColor: "#aaa",
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  };

  return (
    <button onClick={handleChange} className={className}>
      {buttonText}
    </button>
  );
};
