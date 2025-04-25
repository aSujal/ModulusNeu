<?php

use App\Http\Controllers\GroupController;
use App\Http\Controllers\GroupMemberController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post("/groups/update-user-role", [GroupMemberController::class, 'updateUserRole'])->name("update.user.role.group");
    Route::delete("/groups/{groupId}/members/{memberId}", [GroupMemberController::class, "removeUserFromGroup"])->name("remove.user.group");

    Route::get('/groups/{id}', [GroupController::class, 'showUserGroup'])->name('users.group');
    Route::put('/groups/{id}', [GroupController::class, 'updateGroup'])->name('update.group');
    Route::delete('/groups/{id}', [GroupController::class, 'deleteGroup'])->name('delete.group');
    Route::post('/groups/create', [GroupController::class, 'createGroup'])->name('create.group');


    Route::post('/groups/{id}/invitation/create', [GroupController::class, 'createInvitationCode'])->name('create.group.invitation-code');
    Route::post('/groups/invitation/{code}/join', [GroupController::class, 'joinGroup'])->name('create.joinGroup');

    Route::post('/groups/{groupId}/post/create', [PostController::class, 'create'])->name('post.create.post');
    Route::put('/post/{id}/update', [PostController::class, 'update'])->name('post.update.post');
    Route::delete('/post/{id}/delete', [PostController::class, 'destroy'])->name('post.delete.post');

});

require __DIR__ . '/auth.php';
