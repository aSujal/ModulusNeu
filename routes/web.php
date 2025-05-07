<?php

use App\Http\Controllers\GroupController;
use App\Http\Controllers\GroupMemberController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskAnswerController;
use App\Http\Controllers\TaskController;
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
    return Inertia::render('Dashboard/Index');
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

    Route::get('/groups/{groupId}/task/create', [TaskController::class, 'create'])->name('group.create-task');
    Route::post('/groups/{groupId}/task/create', [TaskController::class, 'store'])->name('group.store-task');
    // Route::get('/groups/{groupId}/task/{taskId}/edit', [TaskController::class, 'edit'])->name('create.group.edit-task');
    Route::put('/groups/{groupId}/task/{taskId}/update', [TaskController::class, 'update'])->name('group.update-task');
    Route::get('/groups/{groupId}/tasks', [TaskController::class, 'getTasksForGroup'])->name('groups.tasks');

    // Route::delete('/groups/{groupId}/task/{taskId}/delete', [TaskController::class, 'destroy'])->name('create.group.delete-task');
    Route::get('/task/{taskId}', [TaskController::class, 'index'])->name('group.task');

    Route::get('/task-answers/{answerId}', [TaskAnswerController::class, 'show'])->name('task.answers');
    Route::post('/task/{taskId}/task-answers/create', [TaskAnswerController::class, 'store'])->name('task.store-answer');
    Route::put('/task-answers/update/{groupId}', [TaskAnswerController::class, 'evaluate'])->name('task_answers.update');
    Route::delete('/task-answers/delete/{id}', [TaskAnswerController::class, 'destroy'])->name('task_answers.delete');
    Route::get('/tasks/files/{filenameWithoutExtension}', [TaskController::class, 'showFile']);
    

    Route::post('/groups/{groupId}/post/create', [PostController::class, 'create'])->name('post.create.post');
    // Route::put('/post/{id}/update', [PostController::class, 'update'])->name('post.update.post');
    Route::put('/post/{groupId}/update', [PostController::class, 'update'])->name('post.update.post');

    Route::delete('/post/{id}/delete', [PostController::class, 'destroy'])->name('post.delete.post');

});

require __DIR__ . '/auth.php';
