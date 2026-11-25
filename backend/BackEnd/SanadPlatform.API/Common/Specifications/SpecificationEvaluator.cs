using Microsoft.EntityFrameworkCore;

namespace SanadPlatform.API.Common.Specifications;

/// <summary>
/// Applies an <see cref="ISpecification{T}"/> to an <see cref="IQueryable{T}"/>,
/// composing Criteria, Includes, Ordering, and Paging into a single query pipeline.
/// </summary>
public static class SpecificationEvaluator
{
    /// <summary>
    /// Builds the final <see cref="IQueryable{T}"/> by applying every clause
    /// defined in the specification to the provided input query.
    /// </summary>
    /// <typeparam name="T">The entity type.</typeparam>
    /// <param name="inputQuery">The base queryable (typically a DbSet).</param>
    /// <param name="specification">The specification to apply.</param>
    /// <returns>The fully composed queryable.</returns>
    public static IQueryable<T> GetQuery<T>(
        IQueryable<T> inputQuery,
        ISpecification<T> specification) where T : class
    {
        var query = inputQuery;

        // ==================== Criteria ====================
        if (specification.Criteria is not null)
        {
            query = query.Where(specification.Criteria);
        }

        // ==================== Includes ====================
        query = specification.Includes
            .Aggregate(query, (current, include) => current.Include(include));

        query = specification.IncludeStrings
            .Aggregate(query, (current, include) => current.Include(include));

        // ==================== Ordering ====================
        if (specification.OrderBy is not null)
        {
            query = query.OrderBy(specification.OrderBy);
        }
        else if (specification.OrderByDescending is not null)
        {
            query = query.OrderByDescending(specification.OrderByDescending);
        }

        // ==================== Paging ====================
        if (specification.IsPagingEnabled)
        {
            query = query.Skip(specification.Skip).Take(specification.Take);
        }

        return query;
    }

    /// <summary>
    /// Builds a criteria-only <see cref="IQueryable{T}"/> (no ordering or paging).
    /// Useful for obtaining a total count before applying pagination.
    /// </summary>
    public static IQueryable<T> GetCountQuery<T>(
        IQueryable<T> inputQuery,
        ISpecification<T> specification) where T : class
    {
        var query = inputQuery;

        if (specification.Criteria is not null)
        {
            query = query.Where(specification.Criteria);
        }

        return query;
    }
}
