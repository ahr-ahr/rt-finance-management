<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Resident;
use App\Http\Controllers\ApiController;
use App\Http\Requests\Resident\{
    StoreRequest,
    UpdateRequest
};
use App\Http\Resources\ResidentResource;
use App\Filters\ResidentFilter;
use Illuminate\Support\Facades\Storage;

class ResidentController extends ApiController
{
    public function index(ResidentFilter $filter)
    {
        $query = $filter->apply(Resident::query());

        $residents = $query->paginate(request('per_page', 10));

        return $this->success(
            ResidentResource::collection($residents),
            'List residents',
            200,
            [
                'current_page' => $residents->currentPage(),
                'last_page' => $residents->lastPage(),
                'per_page' => $residents->perPage(),
                'total' => $residents->total(),
            ]
        );
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('ktp_photo')) {
            $path = $request->file('ktp_photo')->store('ktp');
            $data['ktp_photo'] = $path;
        }

        $resident = Resident::create($data);

        return $this->success(
            new ResidentResource($resident),
            'Resident created'
        );
    }

    public function show(Resident $resident)
    {
        return $this->success(
            new ResidentResource($resident),
            'Resident detail'
        );
    }

    public function update(UpdateRequest $request, $id)
    {
        $resident = Resident::findOrFail($id);
        $data = $request->validated();

        if ($request->hasFile('ktp_photo')) {
            if ($resident->ktp_photo) {
                Storage::delete($resident->ktp_photo);
            }

            $data['ktp_photo'] = $request->file('ktp_photo')->store('ktp');
        }

        $resident->update($data);

        return $this->success(
            new ResidentResource($resident),
            'Resident updated'
        );
    }

    public function destroy(Resident $resident)
    {
        if ($resident->ktp_photo) {
            Storage::disk('private')->delete($resident->ktp_photo);
        }

        $resident->delete();

        return $this->success(null, 'Resident deleted');
    }

    public function ktp(Resident $resident)
    {
        if (!$resident->ktp_photo || !Storage::disk('private')->exists($resident->ktp_photo)) {
            abort(404);
        }

        return Storage::disk('private')->response($resident->ktp_photo);
    }
}
