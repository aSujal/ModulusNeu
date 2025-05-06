<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateOrUpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Group;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use \Inertia\Response as InertiaResponse;

class PostController extends Controller
{
    public function create(int $groupId, CreateOrUpdatePostRequest $request)
    {
        $validated = $request->validated();
        $post = Group::findOrFail($groupId)->posts()->create([
            "title" => $validated["title"],
            "description" => $validated["description"],
        ]);

        return $this->backWith(
            'success',
            'Post created successfully'
        );
    }

    public function update(int $groupId, CreateOrUpdatePostRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $post = Post::findOrFail($validated["id"]);
        
        $post->update([
            "title" => $validated["title"],
            "description" => $validated["description"],
        ]);

        return $this->backWith('success','Post updated successfully!');
    }

    public function destroy($postId): RedirectResponse
    {

        $post = Post::findOrFail($postId);

        $groupId = $post->group_id;

        if (Auth::user()->isAdminOrOwner($post->group_id)) {
            $post->delete();
            return $this->backWith('success','Post deleted successfully!');
        }
        return $this->backWith('error','You are not an Admin or Owner of this group.');
    }
}
