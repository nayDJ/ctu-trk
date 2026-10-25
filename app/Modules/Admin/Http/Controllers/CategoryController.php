<?php

namespace App\Modules\Admin\Http\Controllers;

use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use App\Modules\Admin\Support\Auditable;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    use Auditable;

    public function index()
    {
        $categories = Category::latest()->paginate(15);

        return inertia('Admin/Categories/Index', ['categories' => $categories]);
    }

    public function store(StoreCategoryRequest $request)
    {
        $validated = $request->validated();

        $validated['slug'] = $this->uniqueSlug(Str::slug($validated['name']));

        $category = Category::create($validated);

        $this->logAudit('create', 'Category', $category->id);

        return redirect()->route('admin.categories.index')->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $validated = $request->validated();

        if (isset($validated['name'])) {
            $validated['slug'] = $this->uniqueSlug(Str::slug($validated['name']), $category->id);
        }

        $category->update($validated);

        $this->logAudit('update', 'Category', $category->id);

        return redirect()->route('admin.categories.index')->with('success', 'Kategori berhasil diperbarui.');
    }

    public function toggle(Category $category)
    {
        $category->update(['is_active' => ! $category->is_active]);

        $this->logAudit('update', 'Category', $category->id);

        return back()->with('success', 'Status kategori berhasil diubah.');
    }

    public function destroy(Category $category)
    {
        if ($category->complaints()->exists()) {
            return redirect()->route('admin.categories.index')
                ->withErrors(['category' => 'Kategori masih digunakan oleh pengaduan dan tidak dapat dihapus.']);
        }

        $category->delete();

        $this->logAudit('delete', 'Category', $category->id);

        return redirect()->route('admin.categories.index')->with('success', 'Kategori berhasil dihapus.');
    }

    private function uniqueSlug(string $base, ?int $ignoreId = null): string
    {
        $slug = $base;
        for ($i = 2; Category::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists(); $slug = "{$base}-{$i}", $i++) {
            // ponytail: loop secukupnya sampai slug bebas
        }

        return $slug;
    }
}
