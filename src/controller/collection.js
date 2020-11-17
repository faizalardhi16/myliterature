const { books, collection, user } = require('../../models');

exports.getCollection = async (req, res) => {
	try {
		const { id } = req.params;
		const collectionz = await collection.findAll({
			where: {
				userId: id,
			},
			include: {
				model: books,
				as: 'books',
				include: {
					model: user,
					as: 'user',
					attributes: {
						exclude: ['createdAt', 'updatedAt', 'password'],
					},
				},
				attributes: {
					exclude: ['createdAt', 'updatedAt'],
				},
			},

			attributes: {
				exclude: ['createdAt', 'updatedAt'],
			},
		});
		res.status(200).send({
			message: 'Collection has been loaded successfully',
			data: {
				collectionz,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({
			error: {
				message: 'Internal Server Error',
			},
		});
	}
};

exports.addCollection = async (req, res) => {
	try {
		const { booksId } = req.params;

		const collect = await collection.create({
			...req.body,
			booksId: booksId,
		});

		return res.status(200).send({
			message: 'Collection has been added successfully',
			data: {
				collect,
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			error: {
				message: 'Internal Server Error',
			},
		});
	}
};

exports.deleteCollection = async (req, res) => {
	try {
		const { id } = req.params;

		await collection.destroy({
			where: {
				id,
			},
		});

		return res.status(200).send({
			message: 'Collection has been remove',
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			error: {
				message: 'Internal Server Error',
			},
		});
	}
};
