export default function Head() {
  const title = "McDonald's France Price Comparator";
  const description =
    "Compare the price of McDonald's burgers in every French restaurant and find the cheapest store near you.";

  return (
    <>
      <title>McDonald&apos;s France Price Comparator</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta
        name="description"
        content="Compare the price of McDonald's burgers in every French restaurant and find the cheapest store near you."
      />
      <link rel="icon" href="/favicon.ico" />

      <meta property="og:site_name" content={title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content="https://fastsheet.co/" />
      <meta property="og:image:alt" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@totominc" />
      <meta name="twitter:creator" content="@totominc" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  );
}
