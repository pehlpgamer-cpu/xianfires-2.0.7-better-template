export default function currency(value) {
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "";
    }

    return new Intl.NumberFormat(
        "en-PH",
        {
            style: "currency",
            currency: "PHP",
        },
    ).format(amount);
}