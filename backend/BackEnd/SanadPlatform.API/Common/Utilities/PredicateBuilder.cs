using System.Linq.Expressions;

namespace SanadPlatform.API.Common.Utilities;

/// <summary>
/// Helper class for building complex predicates.
/// Allows combining multiple filter conditions with AND/OR logic.
/// </summary>
public static class PredicateBuilder
{
    public static Expression<Func<T, bool>> True<T>() where T : class
    {
        return x => true;
    }

    public static Expression<Func<T, bool>> False<T>() where T : class
    {
        return x => false;
    }

    public static Expression<Func<T, bool>> And<T>(
        this Expression<Func<T, bool>> expr1,
        Expression<Func<T, bool>> expr2) where T : class
    {
        var invokedExpr = Expression.Invoke(expr2, expr1.Parameters);
        return Expression.Lambda<Func<T, bool>>(
            Expression.AndAlso(expr1.Body, invokedExpr),
            expr1.Parameters);
    }

    public static Expression<Func<T, bool>> Or<T>(
        this Expression<Func<T, bool>> expr1,
        Expression<Func<T, bool>> expr2) where T : class
    {
        var invokedExpr = Expression.Invoke(expr2, expr1.Parameters);
        return Expression.Lambda<Func<T, bool>>(
            Expression.OrElse(expr1.Body, invokedExpr),
            expr1.Parameters);
    }
}
