using MediatR;
using SanadPlatform.API.Features.Equipment.DTOs;
using SanadPlatform.API.Features.Equipment.Repository;

namespace SanadPlatform.API.Features.Equipment.Queries;

public record GetEquipmentDetailQuery(Guid Id) : IRequest<EquipmentDetailResponse>;

public class GetEquipmentDetailHandler : IRequestHandler<GetEquipmentDetailQuery, EquipmentDetailResponse>
{
    private readonly IEquipmentRepository _repository;

    public GetEquipmentDetailHandler(IEquipmentRepository repository) => _repository = repository;

    public async Task<EquipmentDetailResponse> Handle(GetEquipmentDetailQuery query, CancellationToken ct)
    {
        var result = await _repository.GetByIdAsync(query.Id, ct);

        // Equipment not found → throw so middleware maps to 404
        if (result == null)
        {
            throw new KeyNotFoundException($"Equipment not found.");
        }

        return result;
    }
}