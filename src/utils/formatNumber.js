export const formatNumber = (number) => {
  const stringNumber = (number + "").replace(/\D/g, "");
  const formattedValue = new Intl.NumberFormat("vi-VN").format(
    parseInt(stringNumber, 10)
  );
  return formattedValue;
};
