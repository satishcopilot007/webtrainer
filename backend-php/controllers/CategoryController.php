<?php
/**
 * Category Controller
 * Handles category endpoints
 */

class CategoryController extends BaseController {

    /**
     * Get All Categories
     * GET /api/categories
     */
    public function getAll() {
        if ($this->getMethod() !== 'GET') {
            Response::error('Method not allowed', null, 405);
        }

        $categoryModel = new CategoryModel($this->conn);
        $categories = $categoryModel->getAllWithCourseCounts();

        Response::success($categories, 'Categories retrieved successfully');
    }
}
?>