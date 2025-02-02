import { createCategory } from "../../controllers/categoryController.js";
import Category from "../../models/Category.js";
import { invalidateCache } from "../../cache/memcached.js";

// Mock the Category model
jest.mock("../../models/Category.js", () => {
  // Create a mock constructor function
  function MockCategory(data) {
    this.name = data.name;
    this._id = "123";
  }

  // Add save method to the prototype
  MockCategory.prototype.save = jest.fn();

  // Add static methods
  MockCategory.findOne = jest.fn();

  return MockCategory;
});

jest.mock("../../cache/memcached.js", () => ({
  invalidateCache: jest.fn(),
}));

describe("createCategory Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        name: "Test Category",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Clear all mocks
    jest.clearAllMocks();
  });

  test("should create a new category successfully", async () => {
    const mockCategory = { name: "Test Category", _id: "123" };

    // Mock the findOne to return null (no existing category)
    Category.findOne.mockResolvedValue(null);

    // Mock the save method to return the mock category
    Category.prototype.save.mockResolvedValue(mockCategory);

    await createCategory(req, res);

    // Verify the category was searched for
    expect(Category.findOne).toHaveBeenCalledWith({ name: "Test Category" });

    // Verify a new category was saved
    expect(Category.prototype.save).toHaveBeenCalled();

    // Verify cache was invalidated (synchronously)
    expect(invalidateCache).toHaveBeenCalledWith("GET:/api/categories");

    // Verify response
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockCategory);
  });

  test("should return 400 if category already exists", async () => {
    // Mock finding an existing category
    Category.findOne.mockResolvedValue({ name: "Test Category" });

    await createCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cette catégorie existe déjà",
    });
  });

  test("should return 400 if data is invalid", async () => {
    req.body = {};

    await createCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: expect.any(String),
    });
  });

  test("should handle database errors", async () => {
    const dbError = new Error("Database error");
    Category.findOne.mockRejectedValue(dbError);

    await createCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Erreur lors de la création de la catégorie",
      error: dbError,
    });
  });
});
