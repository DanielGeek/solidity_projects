export const getTopCreators = (creators) => {
	const finalCreators = [];

	const finalResults = creators?.reduce((index, currentValue) => {
		(index[currentValue.seller] = index[currentValue.seller] || []).push(
			currentValue
		);

		return index;
	}, {});

	if (finalResults) {
		Object?.entries(finalResults).forEach((item) => {
			const seller = item[0];
			const total = item[1]
				.map((newItem) => Number(newItem.price))
				.reduce(
					(previouesValue, currentValue) => previouesValue + currentValue,
					0
				);

			finalCreators.push({ seller, total });
		});
	}

	return finalCreators;
};
