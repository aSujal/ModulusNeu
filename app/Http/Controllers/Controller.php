<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Symfony\Component\HttpFoundation\Response;

abstract class Controller
{
    public function backWith(string $type, string $message, array $data = []): RedirectResponse
    {
        return back()->with(
            'notification',
            [
                'type' =>  $type,
                'message' =>  $message,
                'data' =>  $data
            ]
        );
    }

    public function redirectWith(string $type, string $message, string $route, array $parameters = [], int $status = Response::HTTP_SEE_OTHER, array $headers = [], array $data = []): RedirectResponse
    {
        return Redirect::route($route, $parameters, $status, $headers)
            ->with(
                'notification',
                [
                    'type' =>  $type,
                    'message' =>  $message,
                    'data' =>  $data
                ]
            );
    }
}
