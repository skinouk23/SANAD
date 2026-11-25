using SanadPlatform.API.Infrastructure.Storage;

namespace SanadPlatform.API.Tests.Infrastructure.Storage;

public class MinioStorageServiceTests
{
    [Fact]
    public void NormalizePresignedUrl_UsesHttp_WhenSslIsDisabled()
    {
        const string url = "https://localhost:9000/sanad-patients/avatar.png?X-Amz-Signature=abc123";

        var normalized = MinioStorageService.NormalizePresignedUrl(url, useSsl: false);

        Assert.Equal(
            "http://localhost:9000/sanad-patients/avatar.png?X-Amz-Signature=abc123",
            normalized);
    }

    [Fact]
    public void NormalizePresignedUrl_KeepsHttps_WhenSslIsEnabled()
    {
        const string url = "https://localhost:9000/sanad-providers/avatar.png?X-Amz-Signature=def456";

        var normalized = MinioStorageService.NormalizePresignedUrl(url, useSsl: true);

        Assert.Equal(url, normalized);
    }

    [Fact]
    public void NormalizePresignedUrl_ReturnsOriginal_WhenUrlIsNotAbsolute()
    {
        const string url = "/not-an-absolute-url";

        var normalized = MinioStorageService.NormalizePresignedUrl(url, useSsl: false);

        Assert.Equal(url, normalized);
    }
}
