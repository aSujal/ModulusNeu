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
    public function show(int $postId): InertiaResponse
    {
        return Inertia::render('Post/Show', [
            'post' =>  PostResource::make(Post::find($postId))->jsonSerialize(),
        ]);
    }

    public function create(int $groupId, CreateOrUpdatePostRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $post = Group::findOrFail($groupId)->posts()->create([
            "title" => $validated["title"],
            "status" => $validated["status"],
            "description" => $validated["description"],
            "publish_at" => Carbon::parse($validated["publish_at"])->toDateTimeString(),
        ]);

        return $this->redirectWith(
            'success',
            'Post created successfully',
            'post.show-edit-page',
            ['groupId' => $groupId, 'postId' => $post->id]
        );
    }

    public function update(int $id, CreateOrUpdatePostRequest $request): RedirectResponse
    {
        $post = Post::findOrFail($id);
        if (Auth::user()->isAdminOrOwner($post->group_id)) {
            $validated = $request->validated();
            $post->update([
                "title" => $validated["title"],
                "status" => $validated["status"],
                "description" => $validated["description"],
                "publish_at" => Carbon::parse($validated["publish_at"])->toDateTimeString(),
            ]);

            return $this->backWith('success','Post updated successfully!');
        }
        return $this->backWith('error','You are not an Admin or Owner of this group.');
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
