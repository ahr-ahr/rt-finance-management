<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\BillSetting;
use App\Http\Controllers\ApiController;
use App\Http\Requests\BillSetting\StoreRequest;
use App\Http\Resources\BillSettingResource;

class BillSettingController extends ApiController
{
    public function index()
    {
        $settings = BillSetting::latest('effective_date')->get();

        return $this->success(
            BillSettingResource::collection($settings),
            'List bill settings'
        );
    }

    public function store(StoreRequest $request)
    {
        $setting = BillSetting::create($request->validated());

        return $this->created(
            new BillSettingResource($setting),
            'Bill setting created'
        );
    }
}
