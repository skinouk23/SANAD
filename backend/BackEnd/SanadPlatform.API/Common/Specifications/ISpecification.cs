using System.Linq.Expressions;

namespace SanadPlatform.API.Common.Specifications;

/// <summary>
/// Interface for Specification pattern.
/// Used to encapsulate query logic in a reusable way.
/// </summary>
public interface ISpecification<T>
{
    /// <summary>
    /// Filter criteria (Where clause)
    /// </summary>
    Expression<Func<T, bool>>? Criteria { get; }

    /// <summary>
    /// Navigation properties to include (Join)
    /// </summary>
    List<Expression<Func<T, object>>> Includes { get; }

    /// <summary>
    /// String-based navigation properties to include (Join)
    /// </summary>
    List<string> IncludeStrings { get; }

    /// <summary>
    /// Order by expression
    /// </summary>
    Expression<Func<T, object>>? OrderBy { get; }

    /// <summary>
    /// Order by descending expression
    /// </summary>
    Expression<Func<T, object>>? OrderByDescending { get; }

    /// <summary>
    /// Pagination: items to take
    /// </summary>
    int Take { get; }

    /// <summary>
    /// Pagination: items to skip
    /// </summary>
    int Skip { get; }

    /// <summary>
    /// Flag to enable/disable paging
    /// </summary>
    bool IsPagingEnabled { get; }
}
