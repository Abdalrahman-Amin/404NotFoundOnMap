const formatDate = (date: string | number | Date, weekday: boolean = true) =>
   new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
      ...(weekday && { weekday: "long" }),
   }).format(new Date(date));

export default formatDate;
