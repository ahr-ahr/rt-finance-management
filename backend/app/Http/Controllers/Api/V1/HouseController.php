<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\House;
use App\Http\Controllers\ApiController;
use App\Http\Requests\House\{
    StoreRequest,
    UpdateRequest,
    AssignResidentRequest
};
use App\Http\Resources\HouseResource;
use App\Filters\HouseFilter;
use App\Actions\{AssignResidentToHouseAction, VacateResidentToHouseAction};

class HouseController extends ApiController
{
    public function index(HouseFilter $filter)
    {
        $query = $filter->apply(House::with('currentResident'));

        $houses = $query->paginate(request('per_page', 10));

        return $this->success(
            HouseResource::collection($houses),
            'List houses',
            200,
            [
                'current_page' => $houses->currentPage(),
                'last_page' => $houses->lastPage(),
                'per_page' => $houses->perPage(),
                'total' => $houses->total(),
            ]
        );
    }

    public function store(StoreRequest $request)
    {
        $house = House::create($request->validated());

        return $this->success(
            new HouseResource($house),
            'House created'
        );
    }

    public function show(House $house)
    {
        $house->load('currentResident');

        return $this->success(
            new HouseResource($house),
            'House detail'
        );
    }

    public function update(UpdateRequest $request, $id)
    {
        $house = House::findOrFail($id);

        $house->update($request->validated());

        return $this->success(
            new HouseResource($house),
            'House updated'
        );
    }

    public function destroy(House $house)
    {
        $house->delete();

        return $this->success(null, 'House deleted');
    }

    public function assignResident(
        AssignResidentRequest $request,
        House $house,
        AssignResidentToHouseAction $action
    ) {
        $result = $action->execute($house, $request->resident_id);

        $house = $house->fresh()->load('currentResident.resident');

        if ($result === false) {
            return $this->success(
                new HouseResource($house),
                'Resident already assigned to this house'
            );
        }

        return $this->success(
            new HouseResource($house),
            'Resident assigned to house'
        );
    }

    public function vacate(House $house, VacateResidentToHouseAction $action)
    {
        $result = $action->execute($house);

        if (!$result) {
            return $this->error('No active resident', 400);
        }

        return $this->success(
            $house->fresh(),
            'Resident removed from house'
        );
    }
}
