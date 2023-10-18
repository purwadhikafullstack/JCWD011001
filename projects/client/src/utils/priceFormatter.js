function formatPrice(value) {
  const formattedValue = value?.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  const formattedPrice = formattedValue?.replace("IDR", "Rp").replace(/\s/g, '');

  return formattedPrice;
}

export default formatPrice;
