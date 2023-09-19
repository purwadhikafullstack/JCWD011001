const db = require("../../models");
const Category = db.Category;
const { Op } = db.Sequelize;

const categoryController = {
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;

      // Check if a file has been uploaded
      if (!req.file) {
        return res.status(400).json({ message: "Category image is required" });
      }

      const categoryExist = await Category.findOne({ where: { name, isactive: true } });
      if (categoryExist) {
        return res.status(400).json({ message: "Category already exists" });
      }

      await db.sequelize.transaction(async (t) => {
        const newCategory = await Category.create(
          { name, category_img: req.file.path, isactive: true },
          { transaction: t }
        );
        return res.status(200).json({ message: "Category added", newCategory });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },

  getCategory: async (req, res) => {
    try {
      const categories = await Category.findAll({
        where: { isactive: true },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      if (categories.length === 0) {
        return res.status(404).json({ message: "No categories found" });
      }
      return res.status(200).json({ message: "Success", categories });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id, {
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      return res.status(200).json({ message: "Success", category });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const updatedFields = { name };

      if (req.file) {
        updatedFields.category_img = req.file.path;
      }

      const categoryExist = await Category.findOne({
        where: { name: name },
        id: { [Op.ne]: id },
      });

      if (categoryExist) {
        return res.status(400).json({ message: "Category already exists" });
      }

      const updatedCategory = await Category.findByPk(id);
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      await db.sequelize.transaction(async (t) => {
        await updatedCategory.update(
          updatedFields,
          { where: { id: id } },
          { transaction: t }
        );
        return res.status(200).json({ message: "Category updated", updatedCategory });
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      await db.sequelize.transaction(async (t) => {
        await Category.update(
          { isactive: false },
          { where: { id: id }, transaction: t }
        );
        return res.status(200).json({ message: "Category deleted" });
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = categoryController;
