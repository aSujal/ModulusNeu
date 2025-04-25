<?php

namespace App\Http\Controllers;

use App\Models\GroupMember;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    //posts zeigen
    public function index() {
    }

    // post sehen
    public function show($id) {
    }

    // create seite falls
    public function create() {
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'publish_at' => 'required|date',
            'type' => 'required|integer',
            'group_id' => 'required|exists:groups,id',
        ]);

        $groupMember = GroupMember::where('user_id', Auth::user()->id)
                                    ->where('group_id', $request->input('group_id'))
                                    ->firstOrFail();

        if ($groupMember->isAdminOrOwner()) {
            Post::create($request->all());

            return $this->backWith('success','Post created successfully!');
        }
        return $this->backWith('error','You are not an Admin or Owner of this group.');
    }

    public function update(Request $request, $postId)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'publish_at' => 'required|date',
            'type' => 'required|integer',
            'group_id' => 'required|exists:groups,id',
        ]);
        $post = Post::findOrFail($postId);

    
        $groupMember = GroupMember::where('user_id', Auth::user()->id)
                                    ->where('group_id', $request->input('group_id'))
                                    ->firstOrFail();

        if ($groupMember->isAdminOrOwner()) {
            $post->update($request->only(['title', 'status', 'publish_at', 'type', 'group_id']));
            return $this->backWith('success','Post updated successfully!');
        }
    
        return $this->backWith('error','You are not an Admin or Owner of this group.');
    }

    public function destroy($postId)
    {

        $post = Post::findOrFail($postId);

        $groupId = $post->group_id;

        $groupMember = GroupMember::where('user_id', Auth::user()->id)
                                    ->where('group_id', $groupId)
                                    ->firstOrFail();

        if ($groupMember->isAdminOrOwner()) {
            $post->delete();
            return $this->backWith('success','Post deleted successfully!');
        }
        return $this->backWith('error','You are not an Admin or Owner of this group.');
    }





}
