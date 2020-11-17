const { books, user, category, collection } = require('../../models');

exports.readBooks = async (req, res) => {
	try {
		const book = await books.findAll({
			include: [
				{
					as: 'user',
					model: user,
				},
				{
					as: 'category',
					model: category,
				},
			],
		});
		res.status(200);
		res.send({
			message: 'response success',
			data: { book },
		});
	} catch (err) {
		console.log(err);
		res.status(500);
		res.send({
			message: 'server ERROR',
		});
	}
};

const { Op } = require('sequelize');

exports.getLiteratures = async (req, res) => {
	const { id, title, sort } = req.query;
	console.log(title);
	try {
		const data = await books.findAll({
			where: {
				[Op.or]: [
					{
						id: {
							[Op.eq]: id || '',
						},
					},
					{
						[Op.and]: [
							{
								title: {
									[Op.like]: `%${title || ''}%`,
								},
							},
						],
					},
				],
			},
			include: [
				{
					model: user,
					as: 'user',
					attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
				},
			],
			attributes: {
				exclude: ['createdAt', 'updatedAt', 'userId'],
			},
		});
		console.log(title);
		res.send({
			status: 'success',
			message: 'Literatures fetched successfully',
			data,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			status: 'error',
			message: 'Internal Server Error',
			code: 500,
		});
	}
};

exports.createBooks = async (req, res) => {
	try {
		const data = await books.create({
			...req.body,
			file: req.files.file[0].filename,
		});

		res.send({
			message: 'Book added successfully',
			data: data,
		});
	} catch (error) {
		console.log(err);
		res.status(500);
		res.send({
			message: 'Upload Failed',
		});
	}
};

exports.getTing = async (req, res) => {
	try {
		const { year, search } = req.query;
		const { id } = req.params;

		const bookQuery = {
			where: (year || search) && {
				[Op.and]: [
					year &&
						sequelize.where(
							sequelize.fn('YEAR', sequelize.col('publication')),
							parseInt(year)
						),
					search && { title: { [Op.like]: '%' + search + '%' } },
				],
			},
			include: {
				model: users,
				as: 'users',
				attributes: {
					exclude: ['createdAt', 'updatedAt', 'password'],
				},
			},
			attributes: {
				exclude: ['createdAt', 'updatedAt', 'UserId'],
			},
		};

		const data = !id
			? await books.findAll(bookQuery)
			: await books.findOne({
					where: {
						id,
					},
					include: {
						model: users,
						as: 'users',
						attributes: {
							exclude: ['createdAt', 'updatedAt', 'password'],
						},
					},
					attributes: {
						exclude: ['createdAt', 'updatedAt', 'UserId'],
					},
			  });

		if (data) {
			res.send({
				message: 'Response Successfully',
				data,
			});
		} else {
			throw new Error();
		}
	} catch (err) {
		console.log(err);

		res.status(500).send({
			error: {
				message: 'Server ERROR',
			},
		});
	}
};

exports.deleteBooks = async (req, res) => {
	try {
		const { id } = req.params;

		await books.destroy({
			where: {
				id,
			},
		});

		res.send({
			message: `Delete Success With Id ${id}`,
		});
	} catch (error) {
		console.log(err);
		res.status(500);
		res.send({
			message: 'Delete Failed',
		});
	}
};

exports.readOne = async (req, res) => {
	try {
		const { id } = req.params;

		const detailBooks = await books.findOne({
			where: {
				id,
			},
		});

		res.send({
			message: 'Response Success',
			data: detailBooks,
			user,
		});
	} catch (error) {
		console.log(err);
		res.status(500);
		res.send({
			message: 'Upload Failed',
		});
	}
};

exports.updateBooks = async (req, res) => {
	try {
		const { id } = req.params;

		const detailBooks = await books.findOne({
			where: {
				id,
			},
		});

		const updating = await detailBooks.update(req.body);

		const book = await books.findAll({
			include: [
				{
					as: 'user',
					model: user,
				},
				{
					as: 'category',
					model: category,
				},
			],
		});

		res.send({
			message: 'Update Success',
			data: { book },
		});
	} catch (error) {
		console.log(err);
		res.status(500);
		res.send({
			message: 'Update Failed',
		});
	}
};
