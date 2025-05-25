<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Platform;
use Illuminate\Support\Facades\Request;

class PlatFormController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'platforms' => Platform::all()
        ]);
    }
}
